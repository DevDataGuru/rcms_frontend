"use client";
import IconSave from "@/components/icon/icon-save";
import IconXCircle from "@/components/icon/icon-x-circle";
import React, { useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";

const ComponentsAppsInvoiceAdd = () => {
  return (
    <div className="flex flex-col gap-2.5 xl:flex-row">
      <div className="panel shadow-xl flex-1 px-0 py-6 ltr:xl:mr-6 rtl:xl:ml-6">
        <div className="mt-8 px-4">
          <div className="flex flex-col justify-between lg:flex-row">
            <div className="mb-6 w-full  lg:w-1/2 ltr:lg:mr-6 rtl:lg:ml-6">
              <div className="text-xl text-black font-bold">Add new user</div>
              <div className="mt-4 flex items-center">
                <label
                  htmlFor="reciever-name"
                  className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2"
                >
                  First Name{" "}
                </label>
                <input
                  id="reciever-name"
                  type="text"
                  name="reciever-name"
                  className="form-input flex-1"
                  placeholder="Enter Name"
                />
              </div>
              <div className="mt-4 flex items-center">
                <label
                  htmlFor="reciever-email"
                  className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2"
                >
                  Email (required)
                </label>
                <input
                  id="reciever-email"
                  type="email"
                  name="reciever-email"
                  className="form-input flex-1"
                  placeholder="Enter Email"
                />
              </div>
              <div className="mt-4 flex items-center">
                <label
                  htmlFor="country"
                  className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2"
                >
                  Language
                </label>
                <select
                  id="Language"
                  name="Language"
                  className="form-select flex-1"
                >
                  <option value="">Choose Language</option>
                  <option value="United States">English</option>
                  <option value="United Kingdom">Arabic</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="Sweden">Sweden</option>
                  <option value="Denmark">Denmark</option>
                  <option value="Norway">Norway</option>
                  <option value="New-Zealand">New Zealand</option>
                  <option value="Afghanistan">Afghanistan</option>
                  <option value="Albania">Albania</option>
                  <option value="Algeria">Algeria</option>
                  <option value="American-Samoa">Andorra</option>
                  <option value="Angola">Angola</option>
                </select>
              </div>
              <div className="mt-4 flex items-center">
                <label
                  htmlFor="reciever-number"
                  className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2"
                >
                  Phone Number
                </label>
                <input
                  id="reciever-number"
                  type="text"
                  name="reciever-number"
                  className="form-input flex-1"
                  placeholder="Enter Phone number"
                />
              </div>
              <div className="mt-4 flex items-center">
                <label
                  htmlFor="country"
                  className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2"
                >
                  User role
                </label>
                <select
                  id="User role"
                  name="User role"
                  className="form-select flex-1"
                >
                  <option value="">Choose User Role</option>
                  <option value="United States">Admin</option>
                  <option value="United States">Staff</option>
                  <option value="United States">Manager</option>
                </select>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="text-lg"></div>
              <div className="mt-4 flex items-center">
                <label htmlFor="acno" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                  Last Name{" "}
                </label>
                <input
                  id="acno"
                  type="text"
                  name="acno"
                  className="form-input flex-1"
                  placeholder="Enter Account Number"
                />
              </div>
              <div className="mt-4 flex items-center">
                <label
                  htmlFor="bank-name"
                  className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2"
                >
                  Username (required)
                </label>
                <input
                  id="bank-name"
                  type="text"
                  name="bank-name"
                  className="form-input flex-1"
                  placeholder="Enter Bank Name"
                />
              </div>
              <div className="mt-4 flex items-center">
                <label
                  htmlFor="swift-code"
                  className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2"
                >
                  Password
                </label>
                <input
                  id="swift-code"
                  type="text"
                  name="swift-code"
                  className="form-input flex-1"
                  placeholder="Password"
                />
              </div>
              <div className="mt-4 flex items-center">
                <label
                  htmlFor="iban-code"
                  className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2"
                >
                  Current Branch
                </label>
                <select
                  id="country"
                  name="country"
                  className="form-select flex-1"
                >
                  <option value="">Choose Branch</option>
                  <option value="United States">Head Office</option>
                </select>
              </div>
              <div className="mt-4 flex items-center">
                <label
                  htmlFor="country"
                  className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2"
                >
                  Country
                </label>
                <select
                  id="country"
                  name="country"
                  className="form-select flex-1"
                >
                  <option value="">Choose Country</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="Sweden">Sweden</option>
                  <option value="Denmark">Denmark</option>
                  <option value="Norway">Norway</option>
                  <option value="New-Zealand">New Zealand</option>
                  <option value="Afghanistan">Afghanistan</option>
                  <option value="Albania">Albania</option>
                  <option value="Algeria">Algeria</option>
                  <option value="American-Samoa">Andorra</option>
                  <option value="Angola">Angola</option>
                  <option value="Antigua Barbuda">Antigua &amp; Barbuda</option>
                  <option value="Argentina">Argentina</option>
                  <option value="Armenia">Armenia</option>
                  <option value="Aruba">Aruba</option>
                  <option value="Austria">Austria</option>
                  <option value="Azerbaijan">Azerbaijan</option>
                  <option value="Bahamas">Bahamas</option>
                  <option value="Bahrain">Bahrain</option>
                  <option value="Bangladesh">Bangladesh</option>
                  <option value="Barbados">Barbados</option>
                  <option value="Belarus">Belarus</option>
                  <option value="Belgium">Belgium</option>
                  <option value="Belize">Belize</option>
                  <option value="Benin">Benin</option>
                  <option value="Bermuda">Bermuda</option>
                  <option value="Bhutan">Bhutan</option>
                  <option value="Bolivia">Bolivia</option>
                  <option value="Bosnia">Bosnia &amp; Herzegovina</option>
                  <option value="Botswana">Botswana</option>
                  <option value="Brazil">Brazil</option>
                  <option value="British">British Virgin Islands</option>
                  <option value="Brunei">Brunei</option>
                  <option value="Bulgaria">Bulgaria</option>
                  <option value="Burkina">Burkina Faso</option>
                  <option value="Burundi">Burundi</option>
                  <option value="Cambodia">Cambodia</option>
                  <option value="Cameroon">Cameroon</option>
                  <option value="Cape">Cape Verde</option>
                  <option value="Cayman">Cayman Islands</option>
                  <option value="Central-African">
                    Central African Republic
                  </option>
                  <option value="Chad">Chad</option>
                  <option value="Chile">Chile</option>
                  <option value="China">China</option>
                  <option value="Colombia">Colombia</option>
                  <option value="Comoros">Comoros</option>
                  <option value="Costa-Rica">Costa Rica</option>
                  <option value="Croatia">Croatia</option>
                  <option value="Cuba">Cuba</option>
                  <option value="Cyprus">Cyprus</option>
                  <option value="Czechia">Czechia</option>
                  <option value="Côte">{`Côte d'Ivoire`}</option>
                  <option value="Djibouti">Djibouti</option>
                  <option value="Dominica">Dominica</option>
                  <option value="Dominican">Dominican Republic</option>
                  <option value="Ecuador">Ecuador</option>
                  <option value="Egypt">Egypt</option>
                  <option value="El-Salvador">El Salvador</option>
                  <option value="Equatorial-Guinea">Equatorial Guinea</option>
                  <option value="Eritrea">Eritrea</option>
                  <option value="Estonia">Estonia</option>
                  <option value="Ethiopia">Ethiopia</option>
                  <option value="Fiji">Fiji</option>
                  <option value="Finland">Finland</option>
                  <option value="France">France</option>
                  <option value="Gabon">Gabon</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Greece">Greece</option>
                  <option value="Grenada">Grenada</option>
                  <option value="Guatemala">Guatemala</option>
                  <option value="Guernsey">Guernsey</option>
                  <option value="Guinea">Guinea</option>
                  <option value="Guinea-Bissau">Guinea-Bissau</option>
                  <option value="Guyana">Guyana</option>
                  <option value="Haiti">Haiti</option>
                  <option value="Honduras">Honduras</option>
                  <option value="Hong-Kong">Hong Kong SAR China</option>
                  <option value="Hungary">Hungary</option>
                  <option value="Iceland">Iceland</option>
                  <option value="India">India</option>
                  <option value="Indonesia">Indonesia</option>
                  <option value="Iran">Iran</option>
                  <option value="Iraq">Iraq</option>
                  <option value="Ireland">Ireland</option>
                  <option value="Israel">Israel</option>
                  <option value="Italy">Italy</option>
                  <option value="Jamaica">Jamaica</option>
                  <option value="Japan">Japan</option>
                  <option value="Jordan">Jordan</option>
                  <option value="Kazakhstan">Kazakhstan</option>
                  <option value="Kenya">Kenya</option>
                  <option value="Kuwait">Kuwait</option>
                  <option value="Kyrgyzstan">Kyrgyzstan</option>
                  <option value="Laos">Laos</option>
                  <option value="Latvia">Latvia</option>
                  <option value="Lebanon">Lebanon</option>
                  <option value="Lesotho">Lesotho</option>
                  <option value="Liberia">Liberia</option>
                  <option value="Libya">Libya</option>
                  <option value="Liechtenstein">Liechtenstein</option>
                  <option value="Lithuania">Lithuania</option>
                  <option value="Luxembourg">Luxembourg</option>
                  <option value="Macedonia">Macedonia</option>
                  <option value="Madagascar">Madagascar</option>
                  <option value="Malawi">Malawi</option>
                  <option value="Malaysia">Malaysia</option>
                  <option value="Maldives">Maldives</option>
                  <option value="Mali">Mali</option>
                  <option value="Malta">Malta</option>
                  <option value="Mauritania">Mauritania</option>
                  <option value="Mauritius">Mauritius</option>
                  <option value="Mexico">Mexico</option>
                  <option value="Moldova">Moldova</option>
                  <option value="Monaco">Monaco</option>
                  <option value="Mongolia">Mongolia</option>
                  <option value="Montenegro">Montenegro</option>
                  <option value="Morocco">Morocco</option>
                  <option value="Mozambique">Mozambique</option>
                  <option value="Myanmar">Myanmar (Burma)</option>
                  <option value="Namibia">Namibia</option>
                  <option value="Nepal">Nepal</option>
                  <option value="Netherlands">Netherlands</option>
                  <option value="Nicaragua">Nicaragua</option>
                  <option value="Niger">Niger</option>
                  <option value="Nigeria">Nigeria</option>
                  <option value="North-Korea">North Korea</option>
                  <option value="Oman">Oman</option>
                  <option value="Pakistan">Pakistan</option>
                  <option value="Palau">Palau</option>
                  <option value="Palestinian">Palestinian Territories</option>
                  <option value="Panama">Panama</option>
                  <option value="Papua">Papua New Guinea</option>
                  <option value="Paraguay">Paraguay</option>
                  <option value="Peru">Peru</option>
                  <option value="Philippines">Philippines</option>
                  <option value="Poland">Poland</option>
                  <option value="Portugal">Portugal</option>
                  <option value="Puerto">Puerto Rico</option>
                  <option value="Qatar">Qatar</option>
                  <option value="Romania">Romania</option>
                  <option value="Russia">Russia</option>
                  <option value="Rwanda">Rwanda</option>
                  <option value="Réunion">Réunion</option>
                  <option value="Samoa">Samoa</option>
                  <option value="San-Marino">San Marino</option>
                  <option value="Saudi-Arabia">Saudi Arabia</option>
                  <option value="Senegal">Senegal</option>
                  <option value="Serbia">Serbia</option>
                  <option value="Seychelles">Seychelles</option>
                  <option value="Sierra-Leone">Sierra Leone</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Slovakia">Slovakia</option>
                  <option value="Slovenia">Slovenia</option>
                  <option value="Solomon-Islands">Solomon Islands</option>
                  <option value="Somalia">Somalia</option>
                  <option value="South-Africa">South Africa</option>
                  <option value="South-Korea">South Korea</option>
                  <option value="Spain">Spain</option>
                  <option value="Sri-Lanka">Sri Lanka</option>
                  <option value="Sudan">Sudan</option>
                  <option value="Suriname">Suriname</option>
                  <option value="Swaziland">Swaziland</option>
                  <option value="Switzerland">Switzerland</option>
                  <option value="Syria">Syria</option>
                  <option value="Sao-Tome-and-Principe">
                    São Tomé &amp; Príncipe
                  </option>
                  <option value="Tajikistan">Tajikistan</option>
                  <option value="Tanzania">Tanzania</option>
                  <option value="Thailand">Thailand</option>
                  <option value="Timor-Leste">Timor-Leste</option>
                  <option value="Togo">Togo</option>
                  <option value="Tonga">Tonga</option>
                  <option value="Trinidad-and-Tobago">
                    Trinidad &amp; Tobago
                  </option>
                  <option value="Tunisia">Tunisia</option>
                  <option value="Turkey">Turkey</option>
                  <option value="Turkmenistan">Turkmenistan</option>
                  <option value="Uganda">Uganda</option>
                  <option value="Ukraine">Ukraine</option>
                  <option value="UAE">United Arab Emirates</option>
                  <option value="Uruguay">Uruguay</option>
                  <option value="Uzbekistan">Uzbekistan</option>
                  <option value="Vanuatu">Vanuatu</option>
                  <option value="Venezuela">Venezuela</option>
                  <option value="Vietnam">Vietnam</option>
                  <option value="Yemen">Yemen</option>
                  <option value="Zambia">Zambia</option>
                  <option value="Zimbabwe">Zimbabwe</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 w-full  xl:mt-0 xl:w-96">
        <div className="panel shadow-xl">
          <div className="grid grid-cols-1  gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-1">
            <button type="button" className="btn btn-danger w-full gap-2">
              <IconXCircle className="shrink-0 ltr:mr-2 rtl:ml-2" />
              Close
            </button>
            <button type="button" className="btn btn-success w-full gap-2">
              <IconSave className="shrink-0 ltr:mr-2 rtl:ml-2" />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentsAppsInvoiceAdd;
